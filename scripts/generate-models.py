"""Build editable, photo-reference scooter reconstructions with Blender (no addons).

Run: blender --background --python scripts/generate-models.py -- [aero ...]
Dimensions are approximate visual proportions, not manufacturing measurements.
The source scenes retain named components and packed reference images.
"""
import bpy
import math
import json
import sys
from pathlib import Path
from mathutils import Vector

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'assets' / '3d'
SOURCE = ROOT / 'models' / 'blender'
CONFIG = {
    'aero': dict(folder='Aero', prefix='b5', paint=(.79,.82,.81), style='rounded', lamp='classic', spokes=5),
    'apex': dict(folder='Apex', prefix='optimus', paint=(.018,.024,.029), style='sport', lamp='compact', spokes=5),
    'nova': dict(folder='Nova', prefix='aura', paint=(.012,.018,.022), style='urban', lamp='bar', spokes=6),
    'teja': dict(folder='Teja', prefix='double', paint=(.014,.065,.48), style='sport', lamp='twin', spokes=5),
    'vayu': dict(folder='Vayu', prefix='single', paint=(.008,.15,.13), style='sport', lamp='single', spokes=6),
    'vega': dict(folder='Vega', prefix='d5', paint=(.43,.009,.028), style='rounded', lamp='hex', spokes=8),
}
FRONT_RINGS=[]

def front_surface(y,z,offset=.008):
    """Place front detailing on the curved apron, rather than on a flat plane."""
    for a,b in zip(FRONT_RINGS,FRONT_RINGS[1:]):
        if a[0]<=z<=b[0]:
            t=(z-a[0])/(b[0]-a[0]); x,w,d=[a[i]+t*(b[i]-a[i]) for i in [1,2,3]]
            return x-d*math.sqrt(max(.04,1-(y/w)**2))-offset
    return -.6

def material(name, color, metal=0, rough=.4):
    m=bpy.data.materials.new(name); m.diffuse_color=(*color,1); m.use_nodes=True
    p=m.node_tree.nodes.get('Principled BSDF')
    p.inputs['Base Color'].default_value=(*color,1)
    p.inputs['Metallic'].default_value=metal; p.inputs['Roughness'].default_value=rough
    return m

def finish(obj, name, mat, smooth=True):
    obj.name=name; obj.data.materials.append(mat)
    if smooth and obj.type=='MESH':
        for p in obj.data.polygons: p.use_smooth=True
    return obj

def mesh(name, vertices, faces, mat, sub=0):
    data=bpy.data.meshes.new(name); data.from_pydata(vertices,[],faces); data.update()
    obj=bpy.data.objects.new(name,data); bpy.context.collection.objects.link(obj)
    finish(obj,name,mat)
    if sub:
        mod=obj.modifiers.new('Surface refinement','SUBSURF'); mod.levels=sub
    return obj

def ellipsoid(name, loc, scale, mat):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=32,ring_count=16,location=loc)
    o=finish(bpy.context.object,name,mat); o.scale=scale; return o

def box(name, loc, scale, mat, bevel=.015):
    bpy.ops.mesh.primitive_cube_add(size=1,location=loc); o=bpy.context.object
    o.scale=scale; bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
    finish(o,name,mat)
    if bevel:
        m=o.modifiers.new('Manufactured edge radius','BEVEL'); m.width=bevel; m.segments=3
        m=o.modifiers.new('Panel normals','WEIGHTED_NORMAL')
    return o

def rod(name, a, b, radius, mat, vertices=16):
    a,b=Vector(a),Vector(b); d=b-a
    bpy.ops.mesh.primitive_cylinder_add(vertices=vertices,radius=radius,depth=d.length,location=(a+b)/2)
    o=finish(bpy.context.object,name,mat); o.rotation_euler=d.to_track_quat('Z','Y').to_euler(); return o

def tube(name, points, radius, mat):
    c=bpy.data.curves.new(name,'CURVE'); c.dimensions='3D'; c.resolution_u=16
    c.bevel_depth=radius; c.bevel_resolution=3
    s=c.splines.new('BEZIER'); s.bezier_points.add(len(points)-1)
    for b,p in zip(s.bezier_points,points): b.co=p; b.handle_left_type='AUTO'; b.handle_right_type='AUTO'
    o=bpy.data.objects.new(name,c); bpy.context.collection.objects.link(o); o.data.materials.append(mat); return o

def torus(name, loc, major, minor, mat, rotation=(math.pi/2,0,0), scale=None):
    bpy.ops.mesh.primitive_torus_add(major_segments=64,minor_segments=12,location=loc,major_radius=major,minor_radius=minor,rotation=rotation)
    o=finish(bpy.context.object,name,mat)
    if scale: o.scale=scale
    return o

def signed_power(v, p): return math.copysign(abs(v)**p,v)

def long_loft(name, rings, mat, power=1, sub=2):
    # Each station: x, z centre, half width, half height; elliptical YZ section.
    n=24; verts=[]
    for x,z,w,h in rings:
        for j in range(n):
            a=math.tau*j/n
            verts.append((x,w*signed_power(math.cos(a),power),z+h*signed_power(math.sin(a),power)))
    faces=[tuple(range(n-1,-1,-1))]
    for i in range(len(rings)-1):
        for j in range(n): faces.append((i*n+j,i*n+(j+1)%n,(i+1)*n+(j+1)%n,(i+1)*n+j))
    faces.append(tuple((len(rings)-1)*n+j for j in range(n)))
    return mesh(name,verts,faces,mat,sub)

def apron(name, rings, mat, sub=2):
    # Each station: z, x centre, half width, half depth.
    n=32; verts=[]
    for z,x,w,d in rings:
        for j in range(n):
            a=math.tau*j/n; verts.append((x+d*math.cos(a),w*math.sin(a),z))
    faces=[tuple(range(n-1,-1,-1))]
    for i in range(len(rings)-1):
        for j in range(n): faces.append((i*n+j,(i+1)*n+j,(i+1)*n+(j+1)%n,i*n+(j+1)%n))
    faces.append(tuple((len(rings)-1)*n+j for j in range(n)))
    return mesh(name,verts,faces,mat,sub)

def lens(name, x, yz, mat, depth=.009, bevel=.008):
    # Raised opaque lens: front is negative X. Polygon lies in YZ.
    n=len(yz)
    front=[(front_surface(y,z,.008+max(0,-x-.72)) if x<-.60 else x,y,z) for y,z in yz]
    vs=front+[(px+depth,y,z) for px,y,z in front]
    fs=[tuple(range(n-1,-1,-1)),tuple(range(n,2*n))]
    fs += [(i,(i+1)%n,(i+1)%n+n,i+n) for i in range(n)]
    o=mesh(name,vs,fs,mat)
    if bevel:
        m=o.modifiers.new('Lens perimeter','BEVEL'); m.width=bevel; m.segments=3
        o.modifiers.new('Lens normals','WEIGHTED_NORMAL')
    return o

def fender(name, x, mat):
    verts=[]; faces=[]; n=32; across=12
    for i in range(n+1):
        a=.50+(math.pi-1.0)*i/n
        for j in range(across+1):
            u=-1+2*j/across; r=.265+.018*(1-u*u)
            verts.append((x+r*math.cos(a),u*.095,.235+r*math.sin(a)))
    for i in range(n):
        for j in range(across):
            p=i*(across+1)+j; faces.append((p,p+1,p+across+2,p+across+1))
    o=mesh(name,verts,faces,mat,1); m=o.modifiers.new('Fender thickness','SOLIDIFY'); m.thickness=.009

def wheel(x, label, cfg, mats):
    rubber,alloy,dark,chrome=mats['rubber'],mats['alloy'],mats['dark'],mats['chrome']
    z=.235
    torus(label+' tyre',(x,0,z),.185,.05,rubber,scale=(1,1,1.25))
    for y in [-.058,.058]:
        torus(label+' sidewall bead',(x,y,z),.175,.006,rubber)
        torus(label+' machined rim',(x,y,z),.142,.008,chrome)
        torus(label+' alloy rim',(x,y*.8,z),.132,.011,alloy)
    rod(label+' hub',(x,-.075,z),(x,.075,z),.042,dark,32)
    for side in [-1,1]:
        y=side*.052
        for j in range(cfg['spokes']):
            a=math.tau*j/cfg['spokes']
            rod(label+' cast spoke',(x+.035*math.cos(a),y,z+.035*math.sin(a)),(x+.13*math.cos(a+.18),y,z+.13*math.sin(a+.18)),.013,alloy,8)
        rod(label+' axle cap',(x,y,z),(x,y+side*.02,z),.019,chrome)
    if label=='Front':
        torus('Front brake rotor',(x,-.081,z),.103,.014,chrome)
        for j in range(18):
            a=math.tau*j/18
            ellipsoid('Rotor perforation',(x+.104*math.cos(a),-.095,z+.104*math.sin(a)),(.004,.001,.004),dark)
        box('Front brake caliper',(x+.08,-.088,z+.065),(.052,.035,.074),dark,.01)
    # Fine raised diagonal tread stays actual geometry at the closest zoom.
    for j in range(48):
        a=math.tau*j/48
        for side in [-1,1]:
            r=.234
            p=(x+r*math.cos(a),side*.012,z+r*math.sin(a))
            q=(x+.228*math.cos(a+.045),side*.043,z+.228*math.sin(a+.045))
            rod(label+' tread',p,q,.002,rubber,6)

def reference_images(cfg):
    coll=bpy.data.collections.new('Photo references — approximate proportions'); bpy.context.scene.collection.children.link(coll)
    for view in ['front','side','back','hero']:
        p=ROOT/cfg['folder']/(cfg['prefix']+'_'+view+'.png')
        if not p.exists(): continue
        img=bpy.data.images.load(str(p),check_existing=True); img.pack()
        o=bpy.data.objects.new('Reference '+view,None); o.empty_display_type='IMAGE'; o.data=img
        o.empty_display_size=2.4; o.color[3]=.3; o.hide_render=True; o.hide_viewport=True
        coll.objects.link(o)
        if view=='side': o.rotation_euler=(math.pi/2,0,0); o.location=(0,.6,.65)
        else: o.rotation_euler=(math.pi/2,0,math.pi/2); o.location=(-1.3 if view=='front' else 1.3,0,.65)

def build(model_id):
    global FRONT_RINGS
    cfg=CONFIG[model_id]
    bpy.context.preferences.filepaths.save_version=0
    for o in list(bpy.data.objects): bpy.data.objects.remove(o,do_unlink=True)
    for c in list(bpy.data.collections):
        if c.name.startswith('Photo references'): bpy.data.collections.remove(c)
    bpy.data.orphans_purge(do_recursive=True)
    for c in list(bpy.data.collections):
        if c.users==0: bpy.data.collections.remove(c)
    m={
        'paint':material('Paint • '+model_id,cfg['paint'],.35,.24),
        'dark':material('Graphite moulded trim',(.018,.024,.029),.05,.52),
        'rubber':material('Tyre rubber',(.009,.012,.015),0,.83),
        'seat':material('Seat upholstery',(.035,.043,.05),0,.78),
        'alloy':material('Cast alloy',(.065,.08,.085),.7,.29),
        'chrome':material('Brushed aluminium',(.45,.5,.53),.85,.22),
        'lens':material('Headlamp lens',(.65,.8,.87),.45,.18),
        'led':material('Daylight strip',(.89,.97,1),.1,.25),
        'red':material('Rear lamp',(.48,.008,.018),.25,.22),
        'amber':material('Amber reflector',(.8,.24,.015),.1,.3),
        'screen':material('Instrument glass',(.018,.05,.065),.5,.16),
    }
    rounded=cfg['style']=='rounded'; urban=cfg['style']=='urban'
    wheel(-.665,'Front',cfg,m); wheel(.665,'Rear',cfg,m)
    # Lower chassis and open step-through footboard.
    long_loft('Underfloor chassis',[(-.49,.25,.14,.035),(-.40,.205,.19,.045),(.1,.205,.20,.045),(.4,.28,.18,.06),(.57,.35,.12,.035)],m['dark'],.65)
    long_loft('Painted floor edge',[(-.48,.29,.19,.025),(-.38,.25,.22,.035),(.13,.25,.22,.03),(.4,.32,.19,.035)],m['paint'],.6)
    box('Textured footboard',(-.04,0,.285),(.66,.36,.027),m['dark'],.025)
    for i in range(17):
        x=-.33+i*.033
        rod('Floor grip rib',(x,-.156,.301),(x,.156,.301),.0025,m['rubber'],6)
    # Back inner apron follows the leg shield while exposing a dark rider-facing surface.
    rings=[(.26,-.37,.16,.045),(.29,-.39,.20,.055),(.42,-.47,.23,.07),(.60,-.60,.245,.09),(.73,-.62,.23,.09),(.86,-.55,.19,.065),(.98,-.46,.145,.045),(1.005,-.45,.10,.026)]
    if rounded:
        rings=[(z,x+(0 if z<.65 else .025),w,d*1.14) for z,x,w,d in rings]
    FRONT_RINGS=rings
    apron('Sculpted front leg shield',rings,m['paint'])
    apron('Rider-facing apron',[(z+.005,x+.055,w*.89,d*.56) for z,x,w,d in rings],m['dark'])
    # Seat pedestal and independent rear body panels, with a pointed sport tail.
    long_loft('Seat pedestal',[(.10,.49,.08,.13),(.18,.54,.15,.18),(.5,.57,.19,.19),(.78,.64,.15,.10),(.88,.69,.04,.025)],m['dark'],.8)
    rear=[(.11,.43,.035,.025),(.18,.53,.145,.10),(.31,.59,.225,.14),(.54,.64,.25,.14),(.76,.69,.218,.115),(.90,.735,.14,.065),(.98,.76,.025,.015)]
    if rounded:
        rear=[(x,z-.015,w,h*1.18) for x,z,w,h in rear]
    if urban:
        rear=[(x,z-.02,w*.98,h*.9) for x,z,w,h in rear]
    long_loft('Rear painted bodywork',rear,m['paint'],.9 if rounded else .65)
    seat=[(.065,.79,.025,.015),(.10,.81,.14,.046),(.24,.825,.195,.055),(.48,.85,.20,.05),(.73,.87,.17,.047),(.85,.885,.11,.03),(.87,.885,.025,.012)]
    long_loft('Saddle',seat,m['seat'],.6)
    for side in [-1,1]:
        tube('Saddle piping',[(.12,side*.145,.815),(.28,side*.194,.833),(.53,side*.192,.854),(.75,side*.155,.875),(.83,side*.10,.88)],.002,m['alloy'])
        tube('Rear body seam',[(.18,side*.15,.50),(.36,side*.23,.60),(.62,side*.242,.65),(.85,side*.17,.72)],.0025,m['dark'])
        tube('Passenger grab rail',[(.57,side*.203,.82),(.77,side*.19,.90),(.94,side*.13,.92)],.014,m['chrome'] if rounded else m['alloy'])
        box('Passenger folding footrest',(.25,side*.225,.34),(.13,.036,.025),m['chrome'],.009)
        # Rear suspension body, chrome stanchion and helical spring.
        a=(.50,side*.10,.48); b=(.70,side*.10,.245)
        rod('Rear damper',a,b,.018,m['chrome'])
        points=[]
        axis=Vector(b)-Vector(a); cross=Vector((0,1,0)); other=axis.normalized().cross(cross)
        for j in range(161):
            t=j/160; p=Vector(a)+axis*t+.027*(cross*math.cos(t*math.tau*9)+other*math.sin(t*math.tau*9)); points.append(tuple(p))
        # POLY spline avoids the Bezier overshoot on tight coils.
        c=bpy.data.curves.new('Suspension coil','CURVE'); c.dimensions='3D'; c.bevel_depth=.004; c.bevel_resolution=2
        s=c.splines.new('POLY'); s.points.add(len(points)-1)
        for p,co in zip(s.points,points): p.co=(*co,1)
        o=bpy.data.objects.new('Rear suspension spring',c); bpy.context.collection.objects.link(o); c.materials.append(m['alloy'])
        rod('Front fork lower',(-.66,side*.087,.235),(-.55,side*.087,.49),.022,m['alloy'])
        rod('Front fork stanchion',(-.55,side*.087,.49),(-.48,side*.087,.68),.014,m['chrome'])
    fender('Front mudguard',-.665,m['paint']); fender('Rear wheel hugger',.665,m['dark'])
    # Drivetrain casing is asymmetric, as in the supplied side views.
    long_loft('Motor swingarm',[(.31,.26,.06,.025),(.39,.265,.10,.065),(.66,.25,.105,.09),(.78,.25,.06,.04)],m['dark'],.65)
    casing=ellipsoid('Motor side cover',(.58,-.12,.255),(.235,.045,.085),m['paint'] if model_id=='aero' else m['alloy'])
    for x in [.43,.59,.72]: rod('Motor cover screw',(x,-.165,.255),(x,-.17,.255),.005,m['chrome'],12)
    for side in [-1,1]:
        rod('Centre stand',(.34,side*.07,.23),(.4,side*.12,.015),.011,m['alloy'])
        rod('Stand foot',(.37,side*.12,.015),(.45,side*.12,.015),.011,m['alloy'])
    box('Rear registration bracket',(.96,0,.48),(.032,.17,.14),m['dark'],.005).rotation_euler[1]=-.35
    rod('Rear reflector',(.91,-.115,.51),(.91,-.13,.51),.023,m['amber'],32)
    # Tail lamp, with separate lens strips for a recognisable rear silhouette.
    ellipsoid('Tail lamp housing',(.929,0,.727),(.04,.16,.065),m['dark'])
    ellipsoid('Tail lamp lens',(.955,0,.735),(.022,.145,.045),m['red'])
    for side in [-1,1]: ellipsoid('Rear turn signal',(.948,side*.125,.695),(.022,.04,.026),m['lens'])
    # Steering assembly. The black dash sits on top, facing the rider.
    rod('Steering stem',(-.48,0,.83),(-.40,0,1.085),.029,m['alloy'])
    housing=ellipsoid('Handlebar nacelle',(-.43,0,1.07),(.105,.245,.073),m['paint'])
    if cfg['lamp'] in ['bar','compact']:
        housing.scale.z=.044
        housing.scale.x=.072
    ellipsoid('Instrument cluster',(-.37,0,1.115),(.066,.112,.025),m['dark'])
    ellipsoid('Instrument screen',(-.358,0,1.132),(.049,.087,.008),m['screen'])
    for side in [-1,1]:
        rod('Handlebar',(-.41,side*.17,1.075),(-.38,side*.34,1.055),.014,m['alloy'])
        rod('Rubber hand grip',(-.39,side*.245,1.067),(-.375,side*.35,1.05),.021,m['rubber'],24)
        for j in range(8):
            y=side*(.255+j*.011)
            torus('Grip rib',(-.385,y,1.058),.0205,.0018,m['dark'])
        tube('Brake lever',[(-.44,side*.22,1.065),(-.45,side*.27,1.036),(-.44,side*.35,1.027)],.006,m['alloy'])
        # Two mirrors reconstructed consistently, even where absent in a hero view.
        tube('Mirror stalk',[(-.42,side*.19,1.12),(-.43,side*.23,1.21),(-.44,side*.31,1.27)],.007,m['alloy'])
        ellipsoid('Mirror shell',(-.445,side*.32,1.29),(.027,.067,.045),m['paint'] if model_id=='teja' else m['dark'])
        ellipsoid('Mirror glass',(-.421,side*.32,1.29),(.006,.057,.035),m['chrome'])
    # Model-specific front lighting, following each front photo.
    lamp=cfg['lamp']
    if lamp in ['classic','hex']:
        if lamp=='classic': shape=[(-.10,1.115),(.10,1.115),(.075,1.025),(-.075,1.025)]
        else: shape=[(-.09,1.12),(.09,1.12),(.105,1.07),(.075,1.015),(-.075,1.015),(-.105,1.07)]
        lens('Headlamp chrome surround',-.538,shape,m['chrome'])
        inner=[(y*.85,1.065+(z-1.065)*.82) for y,z in shape]
        lens('Main headlamp',-.548,inner,m['lens'])
        for side in [-1,1]:
            if lamp=='classic': points=[(-.653,side*.16,.88),(-.711,side*.19,.77),(-.724,side*.12,.65)]
            else: points=[(-.635,side*.14,.86),(-.708,side*.11,.67),(-.711,side*.10,.63)]
            points=[(front_surface(y,z,.008),y,z) for x,y,z in points]
            tube('Apron running light surround',points,.012,m['chrome'])
            tube('Apron running light',[(x-.006,y,z) for x,y,z in points],.006,m['led'])
    elif lamp=='bar':
        lens('Horizontal headlamp housing',-.719,[(-.195,.715),(.195,.715),(.17,.663),(-.17,.663)],m['chrome'])
        lens('Horizontal headlamp',-.730,[(-.18,.705),(.18,.705),(.16,.682),(-.16,.682)],m['lens'])
        for side in [-1,1]:
            for j in range(3):
                y=side*(.14+j*.022)
                rod('Lower grille',(front_surface(y,.60),y,.60),(front_surface(y,.65),y,.65),.004,m['chrome'])
    elif lamp=='compact':
        lens('Low headlamp surround',-.716,[(-.12,.70),(.12,.70),(.095,.64),(-.095,.64)],m['chrome'])
        lens('Low headlamp',-.727,[(-.103,.69),(.103,.69),(.085,.655),(-.085,.655)],m['lens'])
        for side in [-1,1]: tube('Angular DRL',[(front_surface(y,z,.013),y,z) for y,z in [(side*.19,.81),(side*.145,.755),(side*.075,.725)]],.008,m['led'])
    else:
        for side in [-1,1]:
            shape=[(side*.025,.72),(side*.195,.83),(side*.17,.66),(side*.065,.62)] if lamp=='twin' else [(side*.008,.72),(side*.135,.77),(side*.12,.64),(side*.015,.605)]
            lens('Apron headlamp bezel',-.722,shape,m['chrome'])
            cy=sum(y for y,z in shape)/4; cz=sum(z for y,z in shape)/4
            lens('Apron headlamp',-.733,[(cy+(y-cy)*.8,cz+(z-cz)*.82) for y,z in shape],m['lens'])
            points=[]
            for y,z in [(side*.205,1.09),(side*.13,1.045),(side*.014,1.035)]:
                x=-.43-.105*math.sqrt(max(.04,1-(y/.245)**2-((z-1.07)/.073)**2))-.006
                points.append((x,y,z))
            tube('Handlebar running light',points,.007,m['led'])
    if cfg['style']=='sport':
        for side in [-1,1]:
            tube('Apron styling crease',[(front_surface(y,z),y,z) for y,z in [(side*.13,.93),(side*.18,.85),(side*.07,.77)]],.003,m['chrome'])
            tube('Rear panel silver accent',[(.23,side*.17,.50),(.50,side*.249,.64),(.86,side*.166,.75)],.005,m['chrome'])
    # A small geometric brand emblem; no photo billboards on the mesh.
    lens('Front emblem',-.646,[(-.027,.90),(0,.94),(.027,.90),(0,.908)],m['chrome'],.001,.001)
    for obj in bpy.context.scene.objects:
        if obj.type in ['MESH','CURVE']:
            obj['construction']='Photo-reference reconstruction; approximate, not CAD'
    # Keep only geometry selected for export; cameras and photo references stay in .blend.
    geometry=[o for o in bpy.context.scene.objects if o.type in ['MESH','CURVE']]
    bpy.ops.object.select_all(action='DESELECT')
    for o in geometry: o.select_set(True)
    bpy.context.view_layer.objects.active=geometry[0]
    # Convert curves and bake modifiers on web export copies. Authored geometry remains editable.
    bpy.ops.object.duplicate(); bpy.ops.object.convert(target='MESH')
    copies=list(bpy.context.selected_objects)
    # Join by material to reduce the native viewer from hundreds of draws to ~12.
    groups=[[o for o in copies if o.data.materials and o.data.materials[0]==mat] for mat in m.values()]
    for group in groups:
        if len(group)<2: continue
        bpy.ops.object.select_all(action='DESELECT')
        for o in group: o.select_set(True)
        bpy.context.view_layer.objects.active=group[0]; bpy.ops.object.join()
    runtime=[o for o in bpy.context.scene.objects if o not in geometry and o.type=='MESH']
    bpy.ops.object.select_all(action='DESELECT')
    for o in runtime: o.select_set(True)
    OUT.mkdir(parents=True,exist_ok=True); SOURCE.mkdir(parents=True,exist_ok=True)
    bpy.ops.export_scene.gltf(filepath=str(OUT/(model_id+'.glb')),export_format='GLB',use_selection=True,export_yup=True,export_apply=True,export_texcoords=False,export_normals=True,export_materials='EXPORT',export_extras=False)
    bpy.ops.object.select_all(action='DESELECT')
    for o in runtime: o.select_set(True)
    bpy.ops.object.delete(use_global=False)
    reference_images(cfg)
    scene=bpy.context.scene; scene.unit_settings.system='METRIC'
    scene['model_id']=model_id
    scene['accuracy']='Visual reconstruction from supplied images. Hidden geometry and dimensions are approximate. Not manufacturer approved.'
    scene['references']=str(ROOT/cfg['folder'])
    # Neutral studio, usable immediately when opened in Blender.
    scene.world.color=(.18,.18,.18)
    bpy.ops.object.camera_add(location=(-2.6,-3.3,1.7)); camera=bpy.context.object
    camera.rotation_euler=(Vector((0,0,.62))-camera.location).to_track_quat('-Z','Y').to_euler(); camera.data.type='ORTHO'; camera.data.ortho_scale=2.65; scene.camera=camera
    for name,loc,power,size in [('Key',(-2,-3,4),650,4),('Fill',(1,3,2.8),500,3),('Rim',(3,-1,3),700,3)]:
        bpy.ops.object.light_add(type='AREA',location=loc); l=bpy.context.object; l.name=name; l.data.energy=power; l.data.shape='DISK'; l.data.size=size; l.rotation_euler=(Vector((0,0,.6))-l.location).to_track_quat('-Z','Y').to_euler()
    scene.render.engine='CYCLES'; scene.cycles.samples=24
    scene.render.resolution_x=1200; scene.render.resolution_y=850; scene.render.resolution_percentage=100
    bpy.ops.wm.save_as_mainfile(filepath=str(SOURCE/(model_id+'.blend')))
    return dict(modelUrl='/assets/3d/'+model_id+'.glb',approved=False,available=True,kind='photo-reconstruction',accuracy='Approximate visual reconstruction from supplied photos; dimensions and hidden details are unverified.',sourceFile='models/blender/'+model_id+'.blend')

if __name__=='__main__':
    args=sys.argv[sys.argv.index('--')+1:] if '--' in sys.argv else list(CONFIG)
    manifest=json.loads((OUT/'manifest.json').read_text()) if (OUT/'manifest.json').exists() else {}
    for model_id in args:
        manifest[model_id]=build(model_id)
        (OUT/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
        print('MODEL_COMPLETE',model_id,flush=True)
